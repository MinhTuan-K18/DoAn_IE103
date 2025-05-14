package com.library_web.library.controller;

import com.library_web.library.dto.BookWithQuantity;
import com.library_web.library.dto.BookDTO;
import com.library_web.library.model.Book;
import com.library_web.library.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book")
@CrossOrigin
public class BookController {
    private final BookService service;
    public BookController(BookService service) { this.service = service; }

    @GetMapping
    public List<BookDTO> getAll() {
        return service.getAllBooks().stream()
        .map(b -> new BookDTO(
            b.getMaSach(), b.getTenSach(), b.getMoTa(),
            b.getTenTacGia(), b.getNxb(), b.getNam(),
            b.getTrongLuong(), b.getDonGia(),
            b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
            b.getTrangThai().name(), b.getHinhAnh(),
            b.getCategoryChild().getId(), b.getCategoryChild().getName(),
            b.getCategoryChild().getCategoryName()
        ))
        .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BookDTO getById(@PathVariable Long id) {
        Book b = service.getBookbyID(id);
        return new BookDTO(
            b.getMaSach(), b.getTenSach(), b.getMoTa(),
            b.getTenTacGia(), b.getNxb(), b.getNam(),
            b.getTrongLuong(), b.getDonGia(),
            b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
            b.getTrangThai().name(), b.getHinhAnh(),
            b.getCategoryChild().getId(), b.getCategoryChild().getName(),
            b.getCategoryChild().getCategoryName()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookDTO add(@RequestBody BookWithQuantity payload) {
        Book book = payload.getBook();
    int initialQuantity = payload.getQuantity();
    Book b = service.addBook(book, initialQuantity);
   // b.updateTrangThai();
    return new BookDTO(
        b.getMaSach(),
        b.getTenSach(),
        b.getMoTa(),
        b.getTenTacGia(),
        b.getNxb(),
        b.getNam(),         
        b.getTrongLuong(),   
        b.getDonGia(),     
        b.getTongSoLuong(),
        b.getSoLuongMuon(),
        b.getSoLuongXoa(),
        b.getTrangThai().name(),
        b.getHinhAnh(),
        b.getCategoryChild().getId(),
        b.getCategoryChild().getName(),
        b.getCategoryChild().getCategoryName()
    );
}


    @PatchMapping("/{id}")
    public BookDTO update(@PathVariable Long id, @RequestBody Map<String,Object> updates) {
        Book b = service.updateBook(id, updates);
        return new BookDTO(
            b.getMaSach(), b.getTenSach(), b.getMoTa(),
            b.getTenTacGia(), b.getNxb(), b.getNam(),
            b.getTrongLuong(), b.getDonGia(),
            b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
            b.getTrangThai().name(), b.getHinhAnh(),
            b.getCategoryChild().getId(), b.getCategoryChild().getName(),
            b.getCategoryChild().getCategoryName()
        );
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delBook(id);
    }

    @GetMapping("/search")
public List<BookDTO> searchBooks(
    @RequestParam(required = false) String author,
    @RequestParam(required = false) String category,
    @RequestParam(required = false) String publisher,
    @RequestParam(required = false) Integer year,
    @RequestParam(defaultValue = "false") boolean sortByBorrowCount,
    @RequestParam(required = false) String title
) {
    return service.searchBooks(author, category, publisher, year, title, sortByBorrowCount).stream()
    .map(b -> new BookDTO(
        b.getMaSach(), b.getTenSach(), b.getMoTa(),
        b.getTenTacGia(), b.getNxb(), b.getNam(),
        b.getTrongLuong(), b.getDonGia(),
        b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
        b.getTrangThai().name(), b.getHinhAnh(),
        b.getCategoryChild().getId(), b.getCategoryChild().getName(),
        b.getCategoryChild().getCategoryName()
    ))
    .collect(Collectors.toList());
}

@GetMapping("/category/{categoryChildId}")
public List<BookDTO> getByCategory(
    @PathVariable String categoryChildId
) {
    return service.getBooksByCategoryChild(categoryChildId).stream()
        .map(b -> new BookDTO(
            b.getMaSach(), b.getTenSach(), b.getMoTa(),
            b.getTenTacGia(), b.getNxb(), b.getNam(),
            b.getTrongLuong(), b.getDonGia(),
            b.getTongSoLuong(), b.getSoLuongMuon(), b.getSoLuongXoa(),
            b.getTrangThai().name(), b.getHinhAnh(),
            b.getCategoryChild().getId(),
            b.getCategoryChild().getName(),
            b.getCategoryChild().getCategoryName()
        ))
        .collect(Collectors.toList());
}

 @GetMapping("/total-books")
    public ResponseEntity<Long> getTotalBooks() {
        long totalBooks = service.getTotalBooks();
        return ResponseEntity.ok(totalBooks);
    }

@GetMapping("/total-book-quantity")
    public ResponseEntity<Long> getTotalBookQuantity() {
        long totalQuantity = service.getTotalBookQuantity();
        return ResponseEntity.ok(totalQuantity);
    }

@GetMapping("/new-books-this-week")
    public ResponseEntity<Long> getNewBooksThisWeek() {
        long newBooks = service.getNewBooksThisWeek();
        return ResponseEntity.ok(newBooks);
    }

}
