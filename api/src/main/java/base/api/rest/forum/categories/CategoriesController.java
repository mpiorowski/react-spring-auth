package base.api.rest.forum.categories;

import base.api.domain.forum.categories.CategoryEntity;
import base.api.logging.LogExecutionTime;
import base.api.rest.forum.categories.dto.CategoryRequestDto;
import base.api.rest.forum.categories.dto.CategoryRespondDto;
import base.api.services.forum.CategoryService;
import org.mapstruct.factory.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/forum/categories")
public class CategoriesController {

  private static final Logger logger = LoggerFactory.getLogger(CategoriesController.class);
  private final CategoryService categoryService;
  private CategoryMapper categoryMapper = Mappers.getMapper(CategoryMapper.class);

  public CategoriesController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  /**
   * GET / : find all categories
   *
   * @return CategoryRespondDto list of all categories
   */
  @LogExecutionTime
  @GetMapping()
  public ResponseEntity<List<CategoryRespondDto>> findAllCategories() {

    List<CategoryEntity> categoryEntities = categoryService.findAll();
    List<CategoryRespondDto> categories =
        categoryEntities.stream()
            .map(
                categoryEntity -> {
                  Integer id = categoryEntity.getId();
                  CategoryRespondDto categoryRespondDto;

                  if (categoryService.findLatestById(id).isPresent()) {
                    categoryRespondDto =
                        categoryMapper.categoriesEntitiesToDto(
                            categoryEntity, categoryService.findLatestById(id).get());
                  } else {
                    categoryRespondDto = categoryMapper.entityToRespondDto(categoryEntity);
                  }
                  categoryRespondDto.setCategoryTopicsNumber(categoryService.countTopicsById(id));
                  categoryRespondDto.setCategoryPostsNumber(categoryService.countPostsById(id));
                  return categoryRespondDto;
                })
            .collect(Collectors.toList());

    return new ResponseEntity<>(categories, HttpStatus.OK);
  }

  /**
   * GET / : find category by uid
   *
   * @return CategoryRespondDto object
   */
  @LogExecutionTime
  @GetMapping("/{categoryUid}")
  public ResponseEntity<CategoryRespondDto> findCategoryByUid(
      @PathVariable("categoryUid") String categoryUid) {

    Optional<CategoryEntity> categoryEntity = categoryService.findByUid(categoryUid);

    if (categoryEntity.isPresent()) {
      CategoryRespondDto categoryRespondDto = categoryMapper.entityToRespondDto(categoryEntity.get());
      return ResponseEntity.ok(categoryRespondDto);
    }
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  }

  /**
   * POST / : add category
   *
   * @param categoryRequestDto object with category data
   * @return uid String
   */
  @LogExecutionTime
  @PostMapping
  public ResponseEntity<CategoryRespondDto> addCategory(@RequestBody CategoryRequestDto categoryRequestDto) {

    CategoryEntity categoryEntity = categoryMapper.dtoToEntity(categoryRequestDto);
    categoryEntity = categoryService.add2(categoryEntity);
    CategoryRespondDto categoryRespondDto = categoryMapper.entityToRespondDto(categoryEntity);

    return new ResponseEntity<>(categoryRespondDto, HttpStatus.CREATED);
  }

  /**
   * PUT / : edit category
   *
   * @param categoryUid category Uid
   * @param categoryRequestDto object with category data
   * @return void
   */
  @LogExecutionTime
  @PutMapping("/{categoryUid}")
  public ResponseEntity editCategory(
      @PathVariable("categoryUid") String categoryUid,
      @RequestBody CategoryRequestDto categoryRequestDto) {
    CategoryEntity categoryEntity = categoryMapper.dtoToEntity(categoryRequestDto);
    //    if (categoryService.edit(categoryEntity)) {
    return new ResponseEntity<>(HttpStatus.OK);
    //    }
    //    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  }

  /**
   * DELETE / : delete category
   *
   * @param categoryUid category Uid
   * @return void
   */
  @LogExecutionTime
  @DeleteMapping("/{categoryUid}")
  public ResponseEntity deleteCategory(@PathVariable("categoryUid") String categoryUid) {
    categoryService.delete(categoryUid);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  //    /**
  //     * PATCH / : activate/deactivate category
  //     *
  //     * @param categoryUid category Uid
  //     * @return void
  //     */
  //    @LogExecutionTime
  //    @PatchMapping("/{categoryUid}")
  //    public ResponseEntity changeStatusCategory(@PathVariable("categoryUid") String categoryUid)
  // {
  //      categoryService.changeStatus(categoryUid);
  //      return new ResponseEntity<>(HttpStatus.OK);
  //    }
}
