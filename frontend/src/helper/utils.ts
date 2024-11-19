import { FilterAnimal, FilterSearchCage } from "@/types/payload";

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
