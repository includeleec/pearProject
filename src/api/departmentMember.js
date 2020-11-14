import $http from "@/assets/js/http";
import { getApiUrl } from "../assets/js/utils";

/* 查找用户 */
export function searchInviteMember(keyword, departmentId) {
  return $http.post("project/member/searchInviteMember", {
    keyword: keyword,
    departmentId: departmentId,
  });
}
export function inviteMember(memberId, departmentId) {
  return $http.post("project/member/inviteMember", {
    memberId,
    departmentId,
  });
}
export function removeMember(memberId, departmentId) {
  return $http.post("project/member/removeMember", {
    memberId,
    departmentId,
  });
}
export function list(data) {
  return $http.post("project/department_member/index", data);
}
export function _downloadTemplate() {
  return getApiUrl("project/department_member/_downloadTemplate");
}
export function detail(data) {
  return $http.post("project/department_member/detail", data);
}
