'use client'

import React from 'react'
import Swal from 'sweetalert2'
import styles from '../add-article/AddArticleModal.module.scss'
import { checkRequiredFields } from '../add-article/page'
import { errorAlert, confirmAlert } from '@/utils/sweetAlertConfig'

export default function EditButtonGroup({ confirmClose, onUpdateArticle }) {
  const handleValidatedUpdateArticle = () => {
    // 先檢查是否填寫必要欄位
    const isValid = checkRequiredFields()

    if (!isValid) {
      const missingFields = getMissingFields()
      errorAlert.fire({
        icon: 'error',
        title: '欄位不完整',
        text: `${missingFields.join('、')} 欄位尚未填寫!`,
      })
      return
    }

    // 檢查圖片路徑格式
    const imagePath = document.querySelector('#imagePath')
    const imageSourceLocal = document.querySelector('#imageSourceLocal')
    
    // 如果使用的是圖片路徑而非本地圖片上傳
    if (imagePath && imagePath.value && (!imageSourceLocal || !imageSourceLocal.checked)) {
      if (!imagePath.value.trim().toLowerCase().startsWith('https://')) {
        errorAlert.fire({
          icon: 'error',
          title: '圖片路徑錯誤',
          text: '圖片路徑必須以 https:// 開頭'
        })
        return
      }
    }

    // 通過所有驗證，執行更新
    onUpdateArticle()
  }

  const getMissingFields = () => {
    const missingFields = []

    const categorySelect = document.querySelector('select[name="文章分類"]')
    const titleInput = document.querySelector('input[placeholder="標題 (必填)"]')
    const imageSourceLocal = document.querySelector('#imageSourceLocal')
    const imageUpload = document.querySelector('#imageUpload')
    const imagePath = document.querySelector('#imagePath')
    const editorInstance = window.editorInstance

    if (categorySelect && categorySelect.value === '0') {
      missingFields.push('文章分類')
    }

    if (titleInput && !titleInput.value.trim()) {
      missingFields.push('標題')
    }

    if (imageSourceLocal && imageSourceLocal.checked) {
      if (!imageUpload || !imageUpload.files || imageUpload.files.length === 0) {
        missingFields.push('主圖 (本地圖片)')
      }
    } else {
      if (!imagePath || !imagePath.value.trim()) {
        missingFields.push('主圖 (圖片路徑)')
      }
    }

    const content = editorInstance?.html.get() || ''
    if (!content || !content.trim() || content.trim() === '<p><br></p>') {
      missingFields.push('文章內容')
    }

    return missingFields
  }

  const handleCancel = () => {
    confirmAlert.fire({
      icon: 'question',
      title: '確定要取消嗎？',
      text: '尚未儲存的變更將會遺失',
      showCancelButton: true,
      confirmButtonText: '是，離開頁面',
      cancelButtonText: '否，繼續編輯',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmClose()
      }
    })
  }

  return (
    <div className="my-4 d-flex justify-content-end">
      <button
        type="button"
        className={`mx-3 btn y-btn-add ${styles['y-btn-add']}`}
        onClick={handleValidatedUpdateArticle}
      >
        更新
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className={`btn btn-danger ${styles['y-btn-cancel']} allowed-close`}
      >
        取消
      </button>
    </div>
  )
}