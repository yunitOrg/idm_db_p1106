<template>
  <div>
    <a-modal
      class="printAction"
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消"
      okText="保存"
      :ok-button-props="{ style: { display: footerDisabled ? 'none' : 'block' } }"
      :cancel-button-props="{ style: { display: footerDisabled ? 'none' : 'block' } }"
      :width="width"
    >
      <slot></slot>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    width: {
      type: String
    },
    visible: {
      type: Boolean,
      required: true
    },
    confirmLoading: {
      type: Boolean
    },
    ok: {
      type: Function
    },
    cancel: {
      type: Function
    },
    footerDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleOk() {
      this.ok && this.ok()
    },
    handleCancel() {
      if (this.cancel) {
        this.cancel()
      } else {
        this.visible = false
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>
