import React, { useEffect, useState } from "react";
import { Checkbox, InputNumber, Typography } from "antd";
import styles from "./styles.module.css";
import { Appointment } from "@/shared/interfaces";
import { sumValuesFromArrayOfObjects } from "@/utils/array";
import { CheckboxChangeEvent } from "antd/es/checkbox";

type TotalProps = {
  appointment: Appointment | null;
  setAppointment: React.Dispatch<React.SetStateAction<Appointment | null>>;
};
const Total: React.FC<TotalProps> = ({ appointment, setAppointment }) => {
  const { Text } = Typography;

  const [priceDividedBy, setPriceDividedBy] = useState<number>(
    appointment?.check.priceDividedBy || 4
  );
  const [pricePaidFor, setPricePaidFor] = useState<number>(
    appointment?.check.pricePaidFor || 0
  );

  useEffect(() => {
    setAppointment(
      (prevAppointment) =>
        ({
          ...prevAppointment,
          check: {
            ...prevAppointment?.check,
            priceDividedBy: priceDividedBy,
            pricePaidFor: pricePaidFor,
          },
        } as Appointment)
    );
  }, [priceDividedBy, pricePaidFor, setAppointment]);

  if (!appointment) return null;
  return (
    <div className={styles.totalContainer}>
      <div>
        <Text strong>{"# Quadra"}</Text>
      </div>
      <div className={styles.totalBodyContainer}>
        <Text className={styles.alignCenter}>
          <i>{`Rateio: `}</i>
          {`R$ ${appointment?.price} /`}
          <InputNumber
            min={1}
            value={priceDividedBy}
            style={{ width: "50px" }}
            onChange={(value: number | null) => {
              if (!value) return;
              setPriceDividedBy(value);
            }}
          />
          <strong>{` = R$ ${(appointment?.price / priceDividedBy).toFixed(
            2
          )} p/ cada`}</strong>
        </Text>
        <div className={styles.alignCenter}>
          <Text>{"Pago:"}</Text>
          {[...Array(priceDividedBy)].map((x, i) => (
            <Checkbox
              key={i}
              checked={i < pricePaidFor}
              onChange={(e: CheckboxChangeEvent) =>
                setPricePaidFor((prev) => (e.target.checked ? ++prev : --prev))
              }
            />
          ))}
        </div>
      </div>

      {appointment?.check.itemsConsumed.length > 0 && (
        <>
          <div>
            <Text strong>{"# Itens consumidos"}</Text>
          </div>
          {appointment?.check.itemsConsumed.map((item, index) => (
            <div key={`item_${index}`} className={styles.totalBodyContainer}>
              <Text className={styles.alignCenter}>
                <i>{`${item.description}: `}</i>
                {`${item.quantity}x R$ ${item.price} = `}
                <strong>{`R$ ${item.quantity * item.price}`}</strong>
              </Text>
              <Text className={styles.alignCenter}>
                {"Pago:"}
                <Checkbox
                  checked={item.paid}
                  onChange={(e: CheckboxChangeEvent) => {
                    let itemsConsumed = [...appointment?.check.itemsConsumed];
                    itemsConsumed[index].paid = e.target.checked;
                    setAppointment(
                      (prevAppointment) =>
                        ({
                          ...prevAppointment,
                          check: {
                            ...prevAppointment?.check,
                            itemsConsumed: itemsConsumed,
                          },
                        } as Appointment)
                    );
                  }}
                />
              </Text>
            </div>
          ))}
        </>
      )}

      <div className={styles.totalBodyContainer}>
        <Text>{"--------------------------------------"}</Text>
        <Text>
          {"Valor total: "}
          <strong>{`R$ ${
            appointment.price +
            sumValuesFromArrayOfObjects(
              appointment.check.itemsConsumed,
              "quantity",
              "price"
            )
          }`}</strong>
        </Text>
      </div>
    </div>
  );
};

export default Total;
