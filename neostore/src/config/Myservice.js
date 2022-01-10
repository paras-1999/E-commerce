import axios from 'axios'
import { MAIN_URL } from './Url';
// let token = sessionStorage.getItem("_token")
export function addloger(data) {
    return axios.post(`${MAIN_URL}user/signup`, data);
}
export function loguser(data) {
    return axios.post(`${MAIN_URL}user/login`, data);
}
export function socialloger(data) {
    return axios.post(`${MAIN_URL}user/sociallogin`, data);
}
export function getproducts(filter) {
    return axios.get(`${MAIN_URL}products/all${filter}`);
}
export function getColors() {
    return axios.get(`${MAIN_URL}products/color`);
}
export function getCategories() {
    return axios.get(`${MAIN_URL}products/category`);
}
export function sendOTP(email) {
    return axios.get(`${MAIN_URL}user/forgetpassword/${email}`);
}
export function checkOTP(email, otp) {
    return axios.get(`${MAIN_URL}user/verifyotp/${email}?otp=${otp}`);
}
export function changePASS(data) {
    return axios.put(`${MAIN_URL}user/updatepass`, data);
}
export function getUser(email) {
    return axios.get(`${MAIN_URL}user/getprofile/${email}`);
}
export function updateProfile(data) {
    return axios.put(`${MAIN_URL}user/updateprofile`, data);
}
export function resetPASS(data) {
    return axios.put(`${MAIN_URL}user/resetpass`, data);
}
export function addAddress(data, email) {
    return axios.put(`${MAIN_URL}user/addaddress/${email}`, data);
}
export function getAddress(email) {
    return axios.get(`${MAIN_URL}user/getaddress/${email}`);
}
export function removeAdd(data, email) {
    return axios.put(`${MAIN_URL}user/removeaddress/${email}`, data);
}
export function pendingList(data, email) {
    return axios.post(`${MAIN_URL}products/pendinglist/${email}`, data);
}
export function pendingCart(email) {
    return axios.get(`${MAIN_URL}products/pendingcart/${email}`);
}
export function viewProduct(id) {
    return axios.get(`${MAIN_URL}products/viewproduct/${id}`);
}
export function authenticationCall(token) {
    return axios.get(`${MAIN_URL}user/verfiy`, {
        headers: { "authorization": `Bearer ${token}` }
    });
}
export function placeOrder(data) {
    return axios.post(`${MAIN_URL}user/placeorder`, data);
}
// export function getmenu(token) {
//     return axios.get(`${MAIN_URL}getmenu`, {
//         headers: { "authorization": `Bearer ${token}` }
//     });
// }
