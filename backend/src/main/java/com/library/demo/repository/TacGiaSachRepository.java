package com.library.demo.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Repository;

@Repository
public class TacGiaSachRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void deleteById(Integer sachId) {
        entityManager.createNativeQuery("DELETE FROM TACGIA_SACH WHERE MASACH = :sachId")
                     .setParameter("sachId", sachId)
                     .executeUpdate();
    }
}
