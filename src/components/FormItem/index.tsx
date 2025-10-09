/*
 * @Author: 郭郭
 * @Date: 2025/9/15
 * @Description:
 */
import { Input, InputNumber, Radio, Select, TreeSelect } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import isFinite from 'lodash/isFinite';

interface FormItemProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  [key: string]: any;
}

const FormItem = ({ value, onChange, ...rest }: FormItemProps) => {
  const comField: any = {
    input: Input,
    radio: Radio.Group,
    select: Select,
    inputNumber: InputNumber,
    treeSelect: TreeSelect,
    textArea: Input.TextArea,
  };

  const handleValueEnum = (data: { [key: string]: any } = {}) => {
    const result = [];
    for (let key in data) {
      const isNumber = /^\d+$/.test(key) && isFinite(key);
      result.push({ label: data[key]?.text || '-', value: isNumber ? Number(key) : key });
    }
    return result;
  };
  const FieldComponent = comField[rest.type || 'input'];
  return (
    <FieldComponent
      value={value}
      onChange={(e: any) =>
        onChange?.(['select'].includes(rest.type as string) ? e : e.target.value)
      }
      {...(['radio', 'checkbox', 'inputNumber'].includes(rest.type as string)
        ? {}
        : { allowClear: true })}
      {...(['select'].includes(rest.type as string)
        ? { showSearch: true, optionFilterProp: 'label' }
        : {})}
      style={{ width: '100%' }}
      {...(['radio', 'select'].includes(rest.type as string)
        ? { options: handleValueEnum(rest.valueEnum) }
        : {})}
      placeholder={rest.defaultPlaceholder}
      {...(rest.fieldBind || {})}
    />
  );
};

export default FormItem;
