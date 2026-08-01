import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Popconfirm, ConfigProvider, theme, Switch } from 'antd';
import { updateGalleryMedia, deleteGalleryMedia } from '@services/gallery';

const { TextArea } = Input;
const { Option } = Select;

const AdminMediaEditor = ({ isOpen, onClose, media, categories, onMediaUpdated, onMediaDeleted }) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (media && isOpen) {
      form.setFieldsValue({
        title: media.title || '',
        caption: media.caption || '',
        category: media.category || 'nature-hall',
        is_visible: media.is_visible !== false, // default true
      });
    }
  }, [media, isOpen, form]);

  const handleSave = async (values) => {
    if (!media) return;
    setIsSaving(true);
    try {
      const updatedMedia = await updateGalleryMedia(media.id, {
        title: values.title,
        caption: values.caption,
        category: values.category,
        is_visible: values.is_visible,
      });
      message.success('Artwork updated successfully!');
      if (onMediaUpdated) onMediaUpdated(updatedMedia);
      onClose();
    } catch (err) {
      console.error('Failed to update media:', err);
      message.error('Failed to update artwork.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!media) return;
    setIsDeleting(true);
    try {
      await deleteGalleryMedia(media.id);
      message.success('Artwork deleted successfully!');
      if (onMediaDeleted) onMediaDeleted(media.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete media:', err);
      message.error('Failed to delete artwork.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Modal
        title={<div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Edit Artwork (Admin)</div>}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        destroyOnHidden
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          requiredMark={false}
        >
        <Form.Item
          name="title"
          label="Artwork Title"
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          name="caption"
          label="Description / Caption"
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Hall / Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select style={{ width: '100%' }}>
            {categories.map((cat) => (
              <Option key={cat.slug} value={cat.slug}>
                {cat.label || cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="is_visible"
          label="Visibility"
          valuePropName="checked"
        >
          <Switch checkedChildren="Visible" unCheckedChildren="Hidden (Soft Delete)" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #27272a' }}>
          <Popconfirm
            title="Are you sure you want to delete this artwork?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button danger type="text">
              Delete Artwork
            </Button>
          </Popconfirm>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default AdminMediaEditor;
