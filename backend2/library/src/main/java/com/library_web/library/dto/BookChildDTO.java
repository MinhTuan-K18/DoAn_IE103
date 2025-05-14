package com.library_web.library.dto;

public class BookChildDTO {
    private String id;
    private String status;
    private Long bookId;

    public BookChildDTO() {}

    public BookChildDTO(String id, String status, Long bookId) {
        this.id = id;
        this.status = status;
        this.bookId = bookId;
    }

    public String getId() {
    return id;
}

public void setId(String id) {
    this.id = id;
}

public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

public Long getBookId() {
    return bookId;
}

public void setBookId(Long bookId) {
    this.bookId = bookId;
}

}