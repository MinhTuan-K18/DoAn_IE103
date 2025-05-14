package com.library_web.library.controller;

import com.library_web.library.dto.BookChildDTO;
import com.library_web.library.model.BookChild;
import com.library_web.library.service.BookChildService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/bookchild")
public class BookChildController {
    private final BookChildService service;
    public BookChildController(BookChildService service) {
        this.service = service;
    }
    @PostMapping("/book/{bookId}/add")
    public BookChildDTO addOne(@PathVariable Long bookId) {
        BookChild c = service.addChild(bookId);
        return new BookChildDTO(c.getId(), c.getStatus().name(), c.getBook().getMaSach());
    }

    @GetMapping("/book/{bookId}")
    public List<BookChildDTO> getByBook(@PathVariable Long bookId) {
        return service.getChildrenByBook(bookId).stream()
            .map(c -> new BookChildDTO(c.getId(), c.getStatus().name(), c.getBook().getMaSach()))
            .collect(Collectors.toList());
    }

    @PatchMapping("/borrow/{id}")
    public BookChildDTO borrow(@PathVariable String id) {
        BookChild c = service.borrowChild(id);
        return new BookChildDTO(c.getId(), c.getStatus().name(), c.getBook().getMaSach());
    }

    @PatchMapping("/return/{id}")
    public BookChildDTO returnBook(@PathVariable String id) {
        BookChild c = service.returnChild(id);
        return new BookChildDTO(c.getId(), c.getStatus().name(), c.getBook().getMaSach());
    }

    @GetMapping("/borrowed")
    public List<BookChildDTO> getBorrowed() {
        return service.findByStatus(BookChild.Status.BORROWED).stream()
            .map(c -> new BookChildDTO(c.getId(), c.getStatus().name(), c.getBook().getMaSach()))
            .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteChild(@PathVariable String id) {
        service.deleteChild(id);
    }

}