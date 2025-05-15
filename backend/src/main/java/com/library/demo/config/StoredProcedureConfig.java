package com.library.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

@Configuration
@EnableJpaRepositories(basePackages = "com.library.demo.repository")
public class StoredProcedureConfig {
    public void customize(LocalContainerEntityManagerFactoryBean factory) {
        factory.setPersistenceUnitPostProcessors(persistenceUnit -> {
            persistenceUnit.addStoredProcedureName("sp_ThemSach");
            persistenceUnit.addStoredProcedureName("sp_CapNhatSach");
            persistenceUnit.addStoredProcedureName("sp_TimKiemSach");
            persistenceUnit.addStoredProcedureName("sp_ThemNXB");
            persistenceUnit.addStoredProcedureName("sp_CapNhatNXB");
            persistenceUnit.addStoredProcedureName("sp_TimKiemNXB");
            persistenceUnit.addStoredProcedureName("sp_ThemTheLoai");
            persistenceUnit.addStoredProcedureName("sp_CapNhatTheLoai");
            persistenceUnit.addStoredProcedureName("sp_TimKiemTheLoai");
            persistenceUnit.addStoredProcedureName("sp_ThemTacGia");
            persistenceUnit.addStoredProcedureName("sp_CapNhatTacGia");
            persistenceUnit.addStoredProcedureName("sp_TimKiemTacGia");
        });
    }
}