/*
 * @Author: taoshiwei
 * @Date: 2019-04-09 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:32:40
 *
 * 企业管理
 */

import { createAPI } from '@/utils/request'
// 企业管理列表
export const list = data => createAPI('/companys', 'get', data)
// 企业管理添加
export const add = data => createAPI('/companys', 'post', data)
// 企业管理修改
export const update = data => createAPI(`/companys/${data.id}`, 'put', data)
// 企业管理删除
export const remove = data => createAPI(`/companys/${data.id}`, 'delete', data)
// 企业管理详情
export const detail = data => createAPI(`/companys/${data.id}`, 'get', data)
// 企业管理设置状态
export const disabled = data =>
  createAPI(`/companys/${data.id}/${data.state}`, 'post', data)
