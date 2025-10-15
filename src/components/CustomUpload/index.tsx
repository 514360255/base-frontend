/*
 * @Author: 郭郭
 * @Date: 2025/9/15
 * @Description:
 */
import { PlusOutlined } from '@ant-design/icons';
import { GetProp, Image, Upload, UploadProps } from 'antd';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

interface CustomUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  uploadProps?: Omit<UploadProps, 'fileList' | 'onChange'>;
  imgCrop?: ImgCropProps;
  isCrop?: boolean;
  [key: string]: any;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CustomUpload = ({ value = [], onChange, ...rest }: CustomUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
    setFileList([...value]);
  }, [JSON.stringify(value)]);

  const customRequest = async ({ file }: any) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('biz', rest.fieldBind?.biz);
      const request = rest.fieldBind?.request;
      if (request) {
        const { url, originalName, uid }: any = await request(formData);
        const obj: UploadFile = {
          uid: uid,
          name: originalName,
          status: 'done',
          url,
        };
        onChange && onChange([...value, obj]);
        setTimeout(() => {
          setFileList([...fileList, obj]);
        }, 200);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemove = (file: UploadFile) => {
    onChange && onChange(value.filter((item) => item.uid !== file.uid));
    setTimeout(() => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    }, 200);
  };

  return (
    <>
      {rest?.fieldBind?.isCrop ? (
        <ImgCrop
          rotationSlider
          showReset
          {...(rest?.fieldBind?.imgCrop || {})}
          onModalOk={customRequest}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onRemove={handleRemove}
            customRequest={customRequest}
            {...(rest.fieldBind || {})}
          >
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>点击上传</div>
            </button>
          </Upload>
        </ImgCrop>
      ) : (
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onRemove={handleRemove}
          customRequest={customRequest}
          {...(rest.fieldBind || {})}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>点击上传</div>
          </button>
        </Upload>
      )}

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
