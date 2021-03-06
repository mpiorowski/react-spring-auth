package base.api.rest.forum.categories.dto;

import lombok.Data;

@Data
public class CategoryRequestDto {
  private String categoryTitle;
  private String categoryDescription;
  private String categoryIcon;
}
