
package com.example.ProjectLaptopStore.Controller;

import com.example.ProjectLaptopStore.DTO.*;
import com.example.ProjectLaptopStore.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;

 
    @GetMapping(value = "/admin/users")
    public Page<User_DTO> getAllUsers(@RequestParam(name = "pageNo")int pageNo, @RequestParam(name = "pageSize")int pageSize){
        Page<User_DTO> rs = userService.searchUser(pageNo,pageSize);
        return rs;
    }

    // Dang ki
    @PostMapping(value = "/register")
    public ResponseEntity<?> createUser(@RequestBody User_RegisterDTO user) {
        userService.createUser(user);
        return ResponseEntity.ok("User created");
    }

    @DeleteMapping(value = "/user-delete/{phoneNumber}")
    public ResponseEntity<?> deleteUser(@PathVariable String phoneNumber) {
        userService.deleteUser(phoneNumber);
        return ResponseEntity.ok("User deleted");
    }

    // Dang nhap
    @PostMapping(value = "/login")
    public User_AuthenticationResponseDTO login(@RequestBody User_LoginDTO user) {
        return userService.Authenticate(user.getPhoneNumber(), user.getPassword());
    }





}