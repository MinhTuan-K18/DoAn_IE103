package com.library_web.library.dto;

import java.util.Collections;
import java.util.List;

public class CategoryWithChildrenNames {
    private String name;
    private List<String> childrenNames;

    public CategoryWithChildrenNames() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getChildrenNames() {
        return childrenNames == null ? Collections.emptyList() : childrenNames;
    }

    public void setChildrenNames(List<String> childrenNames) {
        this.childrenNames = childrenNames;
    }
}
