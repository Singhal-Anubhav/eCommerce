package com.backend.spring_boot_ecommerce.config;

import com.backend.spring_boot_ecommerce.entity.Product;
import com.backend.spring_boot_ecommerce.entity.ProductCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Autowired
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnSupportedActions ={HttpMethod.POST,HttpMethod.PUT,HttpMethod.DELETE};

        //disable HTTP methods for Product: PUT, POST and DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));

        //disable HTTP methods for Product Category: PUT, POST and DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));

        //call an internal heler method
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config){
        //expose entiry ids

        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        for(EntityType<?> entity: entities){
            entityClasses.add(entity.getJavaType());
        }

        //- expose entity id  for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
