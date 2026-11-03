package com.example.ProjectLaptopStore.Service.Impl;

import com.example.ProjectLaptopStore.Entity.Enum.Status_Enum;
import com.example.ProjectLaptopStore.Entity.WareHouseEntity;
import com.example.ProjectLaptopStore.Repository.WareHouseRepository;
import com.example.ProjectLaptopStore.Service.WareHouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WareHouseServiceImpl implements WareHouseService {

    private final WareHouseRepository wareHouseRepository;

    @Override
    public List<WareHouseEntity> getListWareHouse() {
        return wareHouseRepository.findByStatus(Status_Enum.active);
    }

    @Override
    public void createWareHouse(WareHouseEntity wareHouseNew) {
        WareHouseEntity wareHouseEntity = new WareHouseEntity();
        wareHouseRepository.createWareHouse(wareHouseNew, wareHouseEntity);
    }

    @Override
    public void updateWareHouse(WareHouseEntity wareHouseNew) {
        WareHouseEntity wareHouseEntity = wareHouseRepository.findById(wareHouseNew.getWarehouseID())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + wareHouseNew.getWarehouseID()));
        wareHouseRepository.updateWareHouse(wareHouseNew, wareHouseEntity);
    }

    @Override
    public void deleteWareHouse(Integer id) {
        WareHouseEntity wareHouseEntity = wareHouseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + id));
        wareHouseRepository.deleteWareHouse(wareHouseEntity);
    }

    @Override
    public WareHouseEntity getWareHouseById(Integer id) {
        return wareHouseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + id));
    }
}
