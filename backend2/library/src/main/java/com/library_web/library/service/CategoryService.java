package com.library_web.library.service;

import com.library_web.library.model.Category;
import com.library_web.library.dto.CategoryWithChildrenNames;
import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<Category> getAll();
    Category addCategory(CategoryWithChildrenNames payload);
    Category updateCategory(Long id, Map<String, String> updates);
    void deleteCategory(Long id);
    Category findById(Long id);
}
