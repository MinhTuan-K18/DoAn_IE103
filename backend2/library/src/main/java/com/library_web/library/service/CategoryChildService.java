package com.library_web.library.service;

import com.library_web.library.model.CategoryChild;
import java.util.List;

public interface CategoryChildService {
    CategoryChild findChildById(String categoryChildId);
    List<CategoryChild> getByCategory(Long categoryId);
    CategoryChild addChild(Long categoryId, String name);
    CategoryChild updateChild(String id, String newName);  
    void deleteChild(String id);
}
