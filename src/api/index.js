import server from "@/api/server";

//药品信息相关接口
export const listAllDrugInfo = params => server({url: '/drug/list', method: 'get', params});
export const saveDrugInfo = params => server({url: '/drug/save', method: 'post', data: params});
export const deleteDrugInfo = params => server({url: '/drug/delete', method: 'delete', params});

//患者信息相关接口
export const queryPatientInfoByName = params => server({url: '/patient/getByName', method: 'get', params});
export const queryPatientInfoById = params => server({url: '/patient/getById', method: 'get', params});