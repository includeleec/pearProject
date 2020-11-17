import $http from "@/assets/js/http";

export function read(task_stage_id) {
  return $http.post("project/pay_plan/read", { task_stage_id });
}

export function save(data) {
  return $http.post("project/pay_plan/save", data);
}

export function edit(data) {
  return $http.post("project/pay_plan/edit", data);
}

export function del({ task_stage_id }) {
  return $http.post("project/pay_plan/remove", { task_stage_id });
}
