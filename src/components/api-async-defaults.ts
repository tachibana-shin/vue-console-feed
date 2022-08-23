import { Data, readLinkObject, _getListLink } from "../logic/Encode"

export async function _getListLinkAsync(link: Data.Link) {
  return _getListLink(link)
}
export async function readLinkObjectAsync(link: Data.Link) {
  return readLinkObject(link)
}
