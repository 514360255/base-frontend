/*
 * @Author: 郭郭
 * @Date: 2025/9/15
 * @Description:
 */
import { uploadImg } from '@/api/file';
import { PlusOutlined } from '@ant-design/icons';
import { GetProp, Image, Upload, UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

interface CustomUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  uploadProps?: Omit<UploadProps, 'fileList' | 'onChange'>;
  [key: string]: any;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CustomUpload = ({ value = [], onChange, ...rest }: CustomUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>(value || []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 同步 value 变化（如果父级通过 form.setFieldsValue 修改）
  useEffect(() => {
    setFileList(value || []);
  }, [JSON.stringify(value)]);

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // setFileList(newFileList);
    // console.log(newFileList);
    // // 通知父级表单值已变化
    // onChange?.(newFileList);
  };

  const customRequest = async ({ file }: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('biz', 'appointment_disease_type');
    await uploadImg(formData);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        customRequest={customRequest}
        {...(rest.fieldBind || {})}
      >
        <button style={{ border: 0, background: 'none' }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>点击上传</div>
        </button>
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default CustomUpload;
