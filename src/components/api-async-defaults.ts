import { Data, readLinkObject, _getListLink, callFnLink } from "../logic/Encode"

export async function _getListLinkAsync(link: Data.Link) {
  return _getListLink(link)
}
export async function readLinkObjectAsync(link: Data.Link) {
  return readLinkObject(link)
}
export async function callFnLinkAsync(link: Data.Link) {
  return callFnLink(link)
}