// import { useEffect, useState } from "react";

// type DataType<T> = {
//   error: Error | null;
//   filterList: T | null;
//   unFilterList: T | null;
// };
// export const useDatasource = <T,>(
//   fetchData: () => Promise<T>,
//   dependencies: any[]
// ) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [userData, setUserData] = useState<DataType<T>>({
//     error: null,
//     filterList: null,
//     unFilterList: null,
//   });
//   const load = () => {
//     if (!isLoading) setIsLoading(true);
//     fetchData()
//       .then((response) =>
//         setUserData({
//           ...userData,
//           filterList: response,
//           unFilterList: response,
//         })
//       )
//       .catch((error) => setUserData({ ...userData, error: error }))
//       .finally(() => {
//         if (isLoading) setIsLoading(false);
//       });
//   };
//   useEffect(() => {
//     load();
//   }, [...dependencies]);

//   return {
//     isLoading,
//     ...userData,
//     refetch: () => {
//       setIsLoading(true);
//       load();
//     },
//   };
// };

import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export interface IUserResourceProps<T, K extends string> {
  queryFn: () => Promise<T>;
  queryKey: K;
}

// Utility to generate setter name like "setTodos"
function toSetterName<K extends string>(key: K): `set${Capitalize<K>}` {
  return ("set" +
    key.charAt(0).toUpperCase() +
    key.slice(1)) as `set${Capitalize<K>}`;
}

export function useDatasource<T, K extends string>(
  props: IUserResourceProps<T, K>,
  dependencies: any[],
  initialData: T
): {
  [P in K]: T;
} & {
  [P in `set${Capitalize<K>}`]: React.Dispatch<React.SetStateAction<T>>;
} & {
  refetch: () => Promise<void>;
} & {
  isLoading: boolean;
} {
  const { queryFn, queryKey } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T>(initialData);

  const load = async () => {
    if (!isLoading) setIsLoading(true);

    queryFn()
      .then((response) => setData(response))
      .catch((error) =>
        toast({
          toastType: "ERROR",
          description: error.response?.data?.message,
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, dependencies);

  return {
    [queryKey]: data,
    [toSetterName(queryKey)]: setData,
    refetch: load,
    isLoading: isLoading,
  } as any;
}
