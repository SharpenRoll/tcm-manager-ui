import server from "@/api/server";

export const listAllDrugInfo = params => server({url: '/drug/list', method: 'get', params});
export const saveDrugInfo = params => server({url: '/drug/save', method: 'post', data: params});
export const deleteDrugInfo = params => server({url: '/drug/delete', method: 'delete', params});