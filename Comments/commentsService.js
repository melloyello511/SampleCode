import axios from "axios";
import {onGlobalSuccess, onGlobalError, API_HOST_PREFIX} from "./serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("comments");

const endpoint = `${API_HOST_PREFIX}/api/comments`;

let create = (payload) => {
  _logger("... create executing ...")

    const config = {
      method: "POST",
      url: endpoint,
      data: payload,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
  };

  let getPage = (pageIndex, pageSize) => {
    _logger("... getPage executing ...")

    const config = {
      method: "GET",
      url: endpoint + `/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
  };

  let getByEntity = (entityTypeId, entityId) => {
    _logger("... getByEntity executing ...")

    const config = {
      method: "GET",
      url: endpoint + `?entityTypeId=${entityTypeId}&entityId=${entityId}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);  
  }

  export { create, getPage, getByEntity };
  