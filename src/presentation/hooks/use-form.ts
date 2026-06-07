import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;
type ValidateFn<T> = (values: T) => Errors<T>;

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: ValidateFn<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = e.target as HTMLInputElement;
      const { name, value, type, files } = target;
      const nextValue = type === "file" ? (files?.[0] ?? null) : value;
      setValues((prev) => ({ ...prev, [name]: nextValue }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      onValid(values);
    },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const updateValues = useCallback((newValues: T) => {
    setValues(newValues);
    setErrors({});
  }, []);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    setValues: updateValues,
  };
}
