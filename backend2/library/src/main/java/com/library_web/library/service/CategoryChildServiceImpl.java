package com.library_web.library.service;

import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.repository.CategoryChildRepository;
import com.library_web.library.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@Transactional
public class CategoryChildServiceImpl implements CategoryChildService {
    private final CategoryChildRepository childRepo;
    private final CategoryRepository categoryRepo;

    public CategoryChildServiceImpl(CategoryChildRepository childRepo, CategoryRepository categoryRepo) {
        this.childRepo = childRepo;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<CategoryChild> getByCategory(Long categoryId) {
        return childRepo.findByParentIdOrderByIdAsc(categoryId);
    }

    @Override
@Transactional
public CategoryChild addChild(Long categoryId, String name) {
    Category parent = categoryRepo.findById(categoryId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Không tìm thấy danh mục cha: " + categoryId));
    childRepo.findByNameAndParentId(name, categoryId)
        .ifPresent(c -> { throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Đã tồn tại thể loại con '" + name + "' trong danh mục này."); });

            int size = parent.getChildren().size();
    String parentIdStr = String.valueOf(parent.getId()); // Chuyển Long sang String
    String childId;
    do {
        String suffix = generateSuffix(size);
        childId = parentIdStr + suffix;
        size++; 
    } while (childRepo.existsById(childId));

    String suffix = childId.substring(parentIdStr.length());
    CategoryChild child = new CategoryChild(parent, suffix, name);
    parent.addChild(child);
    parent.setSoLuongDanhMuc(parent.getChildren().size());
    categoryRepo.save(parent);
    return child;
}

@Override
@Transactional
public CategoryChild updateChild(String id, String newName) {
    CategoryChild child = childRepo.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục con: " + id));
    Long parentId = child.getParent().getId();
    if (!child.getName().equalsIgnoreCase(newName)) {
        childRepo.findByNameAndParentId(newName, parentId)
            .ifPresent(c -> { 
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đã tồn tại thể loại con '" + newName + "' trong danh mục này."); 
            });
    }

    child.setName(newName);
    return childRepo.save(child);
}


    @Override
    public void deleteChild(String id) {
        CategoryChild child = childRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục con: " + id));
        Category category = child.getParent();
        category.removeChild(child);
        category.setSoLuongDanhMuc(category.getChildren().size());
        childRepo.delete(child);
        categoryRepo.save(category);
    }

    private String generateSuffix(int index) {
        StringBuilder sb = new StringBuilder();
        index++; // 1-based
        while (index > 0) {
            index--;
            sb.insert(0, (char) ('a' + (index % 26)));
            index /= 26;
        }
        return sb.toString();
    }

    public CategoryChild findChildById(String categoryChildId) {
        return childRepo.findById(categoryChildId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục con với ID: " + categoryChildId));
    }


}

