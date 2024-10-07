import React, { useContext, useEffect, useRef, useState } from "react";
import { ConfigProvider, Empty, InputRef, Typography } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { Appointment, ItemConsumed } from "@/shared/interfaces";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id: number;
  quantity: number;
  description: string;
  price: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      if (values.errorFields) return;
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  const handleEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      toggleEdit();
      e.stopPropagation();
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} é obrigatório.`,
          },
        ]}
      >
        <Input
          ref={inputRef}
          type={dataIndex === "description" ? "text" : "number"}
          onPressEnter={save}
          onBlur={save}
          onKeyDown={handleEsc}
          style={{ minWidth: "5rem" }}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {dataIndex === "price" && "R$ "}
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

type ItemsConsumedProps = {
  appointment: Appointment | null;
  setAppointment: React.Dispatch<React.SetStateAction<Appointment | null>>;
};
const ItemsConsumedTable: React.FC<ItemsConsumedProps> = ({
  appointment,
  setAppointment,
}) => {
  const { Link } = Typography;

  const [dataSource, setDataSource] = useState<ItemConsumed[]>(
    appointment?.check.itemsConsumed || []
  );
  const [count, setCount] = useState(dataSource.length);

  useEffect(() => {
    setAppointment(
      (prevAppointment) =>
        ({
          ...prevAppointment,
          check: { ...prevAppointment?.check, itemsConsumed: dataSource },
        } as Appointment)
    );
  }, [dataSource, setAppointment]);

  const handleRemove = (id: number) => {
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Qtd.",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "Preço",
      dataIndex: "price",
      editable: true,
    },
    {
      dataIndex: "operation",
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Certeza que deseja remover?"
            onConfirm={() => handleRemove(record.id)}
          >
            <Link style={{ fontSize: "12px", wordBreak: "keep-all" }}>
              Remover
            </Link>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: ItemConsumed = {
      id: count,
      quantity: 1,
      description: "-",
      price: 0,
      paid: false,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: ItemConsumed) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ItemConsumed) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty description="Nenhum item" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    >
      <Table
        size="small"
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />

      <div className={styles.justifyEnd}>
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}
          type="primary"
          size="small"
          style={{ fontSize: "12px" }}
        >
          Novo item
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default ItemsConsumedTable;
