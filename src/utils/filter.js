import Vue from "vue";
import moment from "moment";

Vue.filter("NumberFormat", function(value) {
  if (!value) {
    return "0";
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断
  return intPartFormat;
});

//文件预览
Vue.filter("showPreviewUrl", function(file) {
  let url = file.file_url;
  const docUrl = "https://view.officeapps.live.com/op/view.aspx?src=";
  let docArr = [
    "doc",
    "docx",
    "docm",
    "dotm",
    "dotx",
    "xlsx",
    "xlsb",
    "xls",
    "xlsm",
    "pptx",
    "ppsx",
    "ppt",
    "pps",
    "pptm",
    "potm",
    "ppam",
    "potx",
    "ppsm",
  ];
  const extension = file.extension;
  const index = docArr.findIndex((item) => item == extension);
  if (index !== -1) {
    url = docUrl + url;
  }
  return url;
});

// 字符串过长，显示省略号
Vue.filter("ellipsis", function(value) {
  const maxStrLen = 16;
  if (!value) return "";
  if (value.length > maxStrLen) {
    return value.slice(0, maxStrLen) + "...";
  }
  return value;
});

Vue.filter("formatToDate", function(datetime_str) {
  if (datetime_str) {
    return moment(datetime_str).format("YYYY-MM-DD");
  } else {
    return "";
  }
});
