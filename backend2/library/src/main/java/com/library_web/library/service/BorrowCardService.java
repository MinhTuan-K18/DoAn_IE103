package com.library_web.library.service;

import com.library_web.library.dto.BorrowCardDTO;
import com.library_web.library.dto.BorrowCardDTO.BookInfo;
import com.library_web.library.model.Book;
import com.library_web.library.model.BookChild;
import com.library_web.library.model.User;
import com.library_web.library.model.BorrowCard;
import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.model.BorrowCard.Status;
import com.library_web.library.model.BorrowedBook;
import com.library_web.library.repository.BookChildRepository;
import com.library_web.library.repository.BookRepository;
import com.library_web.library.repository.BorrowCardRepository;
import com.library_web.library.repository.CategoryChildRepository;
import com.library_web.library.repository.CategoryRepository;
import com.library_web.library.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowCardService {

  @Autowired
  private BorrowCardRepository repository;
  @Autowired
  private BookRepository BookRepository;
  @Autowired
  private UserRepository UserRepository;
  @Autowired
  private CategoryChildRepository CategoryChildRepository;
  @Autowired
  private BookChildRepository childBookRepo;

  // public List<BorrowCardDTO> getAll() {
  // return repository.findAll().stream()
  // .map(this::toDTO)
  // .collect(Collectors.toList());
  // }

  public BorrowCardDTO getBorrowCardDetails(Long id) {
    BorrowCard borrowCard = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Phiếu mượn không tồn tại"));

    // Cập nhật trạng thái trước khi trả về
    // borrowCard.updateStatus(Status.BORROWED);
    repository.save(borrowCard);
    User user = UserRepository.findById(borrowCard.getUserId())
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    List<BorrowedBook> borrowedBooks = borrowCard.getBorrowedBooks();
    List<Long> bookIds = borrowedBooks.stream()
        .map(BorrowedBook::getBookId)
        .distinct()
        .toList();

    List<Book> books = BookRepository.findAllById(bookIds);
    List<BorrowCardDTO.BookInfo> bookInfos = books.stream().map(book -> {
      CategoryChild categoryChild = CategoryChildRepository.findChildById(book.getCategoryChild().getId())
          .orElseThrow(() -> new RuntimeException("Thể loại không tồn tại"));
      return new BorrowCardDTO.BookInfo(
          book.getHinhAnh().get(0),
          book.getTenSach(),
          book.getTenTacGia(),
          categoryChild.getName(), // Lấy tên thể loại con
          book.getNxb(),
          book.getSoLuongMuon());
    }).toList();

    return new BorrowCardDTO(
        borrowCard.getId(),
        user.getId(),
        user.getUsername(),
        bookInfos,
        borrowCard.getBorrowDate(),
        borrowCard.getGetBookDate(),
        borrowCard.getDueDate(),
        bookInfos.size());
  }

  public BorrowCard create(Long userId, List<Long> bookIds) {
    System.out.println("dữ liệu: " + bookIds);
    LocalDateTime borrowDate = LocalDateTime.now();
    // int waitingToTake = settingService.getSetting().getWaitingToTake();
    int waitingToTake = 3;
    List<BorrowedBook> borrowedBooks = bookIds.stream()
        .map(id -> new BorrowedBook(id, null))
        .toList();
    BorrowCard borrowCard = new BorrowCard(userId, borrowDate, waitingToTake, borrowedBooks);
    for (Long bookId : bookIds) {
      Book book = BookRepository.findById(bookId)
          .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + bookId));

      book.setSoLuongMuon(book.getSoLuongMuon() + 1);
      BookRepository.save(book);
    }
    return repository.save(borrowCard);
  }

  // public BorrowCardDTO update(Long id, BorrowCardDTO dto) {
  // Optional<BorrowCard> optional = repository.findById(id);
  // if (optional.isEmpty())
  // return null;

  // BorrowCard card = optional.get();
  // card.setBookIds(dto.getBookIds());
  // card.setDueDate(dto.getDueDate());
  // card.setGetBookDate(dto.getGetBookDate());
  // card.setStatus(dto.getStatus());

  // return toDTO(repository.save(card));
  // }

  public boolean delete(Long id) {
    if (!repository.existsById(id))
      return false;
    repository.deleteById(id);
    return true;
  }

  // private BorrowCardDTO toDTO(BorrowCard card) {
  // BorrowCardDTO dto = new BorrowCardDTO();
  // dto.setId(card.getId());
  // dto.setUserId(card.getUserId());
  // dto.setBookIds(card.getBookIds());
  // dto.setBorrowDate(card.getBorrowDate());
  // dto.setDueDate(card.getDueDate());
  // dto.setGetBookDate(card.getGetBookDate());
  // dto.setStatus(card.getStatus());
  // return dto;
  // }

  public List<BorrowCard> getBorrowCardsByUserId(Long userId) {
    return repository.findByUserId(userId); // Trả về tất cả phiếu mượn của userId
  }

  // Cập nhật phiếu mượn khi người dùng đến lấy sách
  public BorrowCard updateBorrowCardToBorrowing(Long id, List<String> childBookIds) {
    BorrowCard borrowCard = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Phiếu mượn không tồn tại"));

    // Cập nhật trạng thái và ngày giờ
    borrowCard.setStatus(BorrowCard.Status.BORROWED.getStatusDescription());
    borrowCard.setGetBookDate(LocalDateTime.now());
    int borrowDay = 7; // giả định
    borrowCard.setDueDate(LocalDateTime.now().plusDays(borrowDay));

    // Lấy danh sách BorrowedBook hiện có
    List<BorrowedBook> borrowedBooks = borrowCard.getBorrowedBooks();

    for (String childId : childBookIds) {
        BookChild child = childBookRepo.findById(childId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách con với id: " + childId));

        Long parentId = child.getBook().getMaSach(); // lấy id sách cha thực tế từ sách con

        // Tìm BorrowedBook phù hợp với sách cha này và chưa có sách con
        BorrowedBook matched = borrowedBooks.stream()
            .filter(bb -> bb.getBookId().equals(parentId) && (bb.getChildBookId() == null || bb.getChildBookId().isEmpty()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách cha phù hợp cho sách con id: " + childId));

        // Gán childBookId vào BorrowedBook
        matched.setChildBookId(childId);

        // Đánh dấu sách con là đã được mượn
        child.setStatus(BookChild.Status.BORROWED);
        childBookRepo.save(child);
    }

    borrowCard.setBorrowedBooks(borrowedBooks); // cập nhật lại danh sách
    return repository.save(borrowCard);
}

  // Cập nhật phiếu mượn khi người dùng trả sách
  public BorrowCard updateBorrowCardOnReturn(Long id) {
    BorrowCard borrowCard = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Phiếu mượn không tồn tại"));

    // Kiểm tra và cập nhật trạng thái phiếu mượn
    if (borrowCard.getStatus().equals(BorrowCard.Status.BORROWED.getStatusDescription())) {
        borrowCard.setStatus(BorrowCard.Status.RETURNED.getStatusDescription());
    }

    // Cập nhật ngày trả sách
    borrowCard.setDueDate(LocalDateTime.now());

    // Cập nhật trạng thái sách con
    List<String> childBookIds = borrowCard.getBookIds(); // lấy danh sách sách con
    for (String childId : childBookIds) {
        BookChild child = childBookRepo.findById(childId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách con với id: " + childId));

        // Đánh dấu sách con là đã trả, trạng thái là AVAILABLE
        child.setStatus(BookChild.Status.AVAILABLE);
        childBookRepo.save(child); // lưu lại trạng thái của sách con
    }

    // Cập nhật số lượng sách trong kho
    List<Long> bookIds = borrowCard.getBookIds().stream()
        .map(Long::valueOf)
        .collect(Collectors.toList());
    
    for (Long bookId : bookIds) {
        Book book = BookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + bookId));

        // Giảm số lượng sách mượn (SoLuongMuon)
        book.setSoLuongMuon(book.getSoLuongMuon() - 1);
        BookRepository.save(book); // lưu lại thông tin sách
    }

    // Lưu phiếu mượn sau khi cập nhật
    return repository.save(borrowCard);
}
}
