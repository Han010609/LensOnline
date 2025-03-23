'use client'

import React from 'react'
import Swal from 'sweetalert2'
import styles from '../add-article/AddArticleModal.module.scss'
import { checkRequiredFields } from '../add-article/page'

export default function EditButtonGroup({ confirmClose, onUpdateArticle }) {
  const handleValidatedUpdateArticle = () => {
    const isValid = checkRequiredFields()

    if (!isValid) {
      const missingFields = getMissingFields()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${missingFields.join('、')} 欄位尚未填寫!`,
      })
      return
    }

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
        onClick={confirmClose}
        className={`btn btn-danger ${styles['y-btn-cancel']} allowed-close`}
      >
        取消
      </button>
    </div>
  )
}