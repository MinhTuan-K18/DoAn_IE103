package com.library_web.library.model;

public class GoogleLoginRequest {
    private String IdToken;

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String IdToken) {
        this.IdToken = IdToken;
    }

    public String getIdToken() {
        return IdToken;
    }

    public void setIdToken(String IdToken) {
        this.IdToken = IdToken;
    }
}
