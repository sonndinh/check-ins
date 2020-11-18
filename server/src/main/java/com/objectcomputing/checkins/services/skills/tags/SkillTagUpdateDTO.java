package com.objectcomputing.checkins.services.skills.tags;

import com.objectcomputing.checkins.services.skills.SkillResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class SkillTagUpdateDTO {
    @Schema(description = "unique identifier of the tag", required = true)
    @NotNull
    private UUID id;

    @Schema(description = "name of the tag", required = true)
    @NotBlank
    private String name;

    @Schema(description = "description of the tag")
    private String description;

    @Schema(description = "skills tagged by this")
    private List<SkillResponseDTO> skills;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<SkillResponseDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillResponseDTO> skills) {
        this.skills = skills;
    }
}