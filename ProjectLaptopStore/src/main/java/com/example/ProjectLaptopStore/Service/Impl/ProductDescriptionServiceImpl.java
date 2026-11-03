package com.example.ProjectLaptopStore.Service.Impl;

import com.example.ProjectLaptopStore.Convert.Product_DescriptionDTOConverter;
import com.example.ProjectLaptopStore.DTO.ProductDescriptionDTO;
import com.example.ProjectLaptopStore.Entity.ProductDescriptionEntity;
import com.example.ProjectLaptopStore.Repository.ProductDescriptionRepository;
import com.example.ProjectLaptopStore.Service.ProductDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductDescriptionServiceImpl implements ProductDescriptionService {

    @Autowired
    private ProductDescriptionRepository productDescriptionRepository;

    @Autowired
    private Product_DescriptionDTOConverter productDescriptionDTOConverter;

    @Override
    public List<ProductDescriptionDTO> finAllProductDescription() {
        List<ProductDescriptionEntity> productDescriptionEntityList = productDescriptionRepository.findAll();
        List<ProductDescriptionDTO> result = new ArrayList<>();
        for (ProductDescriptionEntity item : productDescriptionEntityList) {
            ProductDescriptionDTO productDescription = productDescriptionDTOConverter.toProductDescriptionDTO(item);
            result.add(productDescription);
        }
        return result;
    }

    @Override
    public ProductDescriptionDTO finProductDescriptionById(Long productID) {
        ProductDescriptionEntity productDescriptionEntity = productDescriptionRepository.findAllByProductId(productID);
        ProductDescriptionDTO result = productDescriptionDTOConverter.toProductDescriptionDTO(productDescriptionEntity);
        return result;
    }

    //API lấy công nghệ CPU cho checkbox
    @Override
    public Map<String, String> getCPUTechnologyForCheckbox() {
        Map<String, String> result = new HashMap<>();
        List<ProductDescriptionEntity> productDescriptionEntityList = productDescriptionRepository.findAll();
        for (ProductDescriptionEntity item : productDescriptionEntityList) {
            String cpuTechnology = item.getCpuTechnology();
            if (cpuTechnology != null && !cpuTechnology.isBlank()) {
                result.put(cpuTechnology, cpuTechnology);
            }

        }
        return result;
    }

    @Override
    public Map<Integer, Integer> getRamCapacityForCheckbox() {
        Map<Integer, Integer> result = new HashMap<>();
        List<ProductDescriptionEntity> productDescriptionEntityList = productDescriptionRepository.findAll();
        for (ProductDescriptionEntity item : productDescriptionEntityList) {
            Integer ramCapacity = item.getRamCapacity();
            if (ramCapacity != null) {
                result.put(ramCapacity, ramCapacity);
            }
        }
        return result;
    }

    @Override
    public Map<String, String> getHardDriveForCheckbox() {
        Map<String, String> result = new HashMap<>();
        List<ProductDescriptionEntity> productDescriptionEntityList = productDescriptionRepository.findAll();
        for (ProductDescriptionEntity item : productDescriptionEntityList) {
            String hardDriveType = item.getHardDriveType();
            if (hardDriveType != null && !hardDriveType.isBlank()) {
                result.put(hardDriveType, hardDriveType);
            }
        }
        return result;
    }

    @Override
    public Map<String, String> getScreensizeForCheckbox() {
        Map<String, String> result = new HashMap<>();
        List<ProductDescriptionEntity> productDescriptionEntityList = productDescriptionRepository.findAll();
        for (ProductDescriptionEntity item : productDescriptionEntityList) {
            String screenSize = item.getScreenSize();
            if (screenSize != null && !screenSize.isBlank()) {
                result.put(screenSize, screenSize);
            }

        }
        return result;
    }


}
