import {reloadAuthorized} from "@/utils/Authorized";

export function getUser() {
  if (localStorage.getItem("user") !== null) {
    return JSON.parse(localStorage.getItem("user"));
  }
  return {};
}

export function setUser(info) {
  return localStorage.setItem("user", info ? JSON.stringify(info) : "");
}

export function getToken() {
  const user = localStorage.getItem("user");
  if (user && user !== "null") {
    return JSON.parse(user).token;
  }
  return null;
}

export function getAuthority(str) {
  const authorityString =
    typeof str === "undefined" ? localStorage.getItem("authority") : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const currentAuthority =
    typeof authority === "string" ? [authority] : authority;
  localStorage.setItem("authority", JSON.stringify(currentAuthority));
  reloadAuthorized();
}
