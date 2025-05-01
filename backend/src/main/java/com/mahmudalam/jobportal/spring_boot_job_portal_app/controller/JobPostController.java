package com.mahmudalam.jobportal.spring_boot_job_portal_app.controller;


import com.mahmudalam.jobportal.spring_boot_job_portal_app.interfaces.JobPostRepository;
import com.mahmudalam.jobportal.spring_boot_job_portal_app.model.JobPostModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
public class JobPostController {

    @Autowired
    JobPostRepository repo;

    @ApiIgnore
    @RequestMapping(value = "/")
    public void redirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui.html");
    }

    @GetMapping("/job-posts")
    public List<JobPostModel> getAllJobPosts(){
        return repo.findAll();
    }
}
