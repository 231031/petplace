import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { UploadRes } from "@/types/response";

export async function RequestApi(endpoint:string, method:string, payload: any, checkStatus: number): Promise<any> {
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Response in:", response);
      console.log("Data in:", data);
      if (response.status != checkStatus) {
        return Promise.reject(data);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
}

export function MapArrayToQuery(
  filterAnimal: FilterAnimal[],
  filterSearchCage: FilterSearchCage
): string {
    // console.log("FilterAnimal Input:", JSON.stringify(filterAnimal, null, 2));
    // console.log("FilterSearchCage Input:", JSON.stringify(filterSearchCage, null, 2));
    let queryParams = "";
    Object.entries(filterSearchCage).forEach(([key, value]) => {
        if (value) {
          queryParams += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
        }
      });
  
      filterAnimal.forEach((filter, index) => {
          if (filter.animal_type != "" && filter.cage_size != "") {
              queryParams += `animals[${index}].animal_type=${encodeURIComponent(filter.animal_type)}&`;
              queryParams += `animals[${index}].cage_size=${encodeURIComponent(filter.cage_size)}&`;
          }
      });
      queryParams = queryParams.slice(-1) === '&' ? queryParams.slice(0, -1) : queryParams;
      // console.log("Query Params:", queryParams);
      return queryParams;
}

export function UpdateImageArray(newImages:UploadRes[], images:string[] | undefined, strImage:string | undefined): string[] {
  if (strImage == "") {
    let updatedImages: string[] = [];
    newImages.forEach(image => {
      updatedImages.push(image.fileUrl)
    })
    return updatedImages
  }

  if ( images ) {
    newImages.forEach(image => {
      images.push(image.fileUrl)
    })
    return images
  }

  return []
}

export function formatDateToString(date: Date | null): string {
  if (date != null) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  return ""
}

export function formatDateToStringNew(input: Date | string): string {
  // Convert input to a Date object if it's a string
  const date = typeof input === "string" ? new Date(input) : input;

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
