export default function hasPermission(permission){
    let flag=false;
    let permissionCode=JSON.parse(sessionStorage.getItem("permissionCode"));
    for (let i=0;i<permissionCode.length;i++){
        if (permissionCode[i]==permission){
            flag=true;
            break;
        }
    }
    return flag;

}