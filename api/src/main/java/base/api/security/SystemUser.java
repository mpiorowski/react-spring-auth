package base.api.security;

import base.api.domain.user.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class SystemUser implements UserDetails {

  private Integer userId;

  private String userName;

  private String userEmail;

  @JsonIgnore private String userPassword;

  private Collection<? extends GrantedAuthority> authorities;

  private SystemUser(
      Integer userId,
      String userName,
      String userEmail,
      String userPassword,
      Collection<? extends GrantedAuthority> authorities) {
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.authorities = authorities;
  }

  static SystemUser createUser(UserEntity user) {
    List<GrantedAuthority> authorities =
        user.getUserRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

    return new SystemUser(
        user.getId(), user.getUserName(), user.getUserEmail(), user.getUserPassword(), authorities);
  }

  public UserEntity getUser() {

    List<String> roles = this.authorities.stream().map(Object::toString).collect(Collectors.toList());

    UserEntity userEntity = new UserEntity();
    userEntity.setId(this.userId);
    userEntity.setUserName(this.userName);
    userEntity.setUserEmail(this.userEmail);
    userEntity.setUserRoles(roles);
    return userEntity;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return userPassword;
  }

  @Override
  public String getUsername() {
    return userName;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public Integer getUserId() {
    return userId;
  }

  public String getUserEmail() {
    return userEmail;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SystemUser that = (SystemUser) o;
    return Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId);
  }
}
