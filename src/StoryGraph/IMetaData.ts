/**P. Kessling *Hamburg, September 2020*/
/**
 * 
 */
export interface IMetaData {

    /**
     * 
     */
    name: string;
    /**
     * 
     */
    createdAt: Date;
    /**
     * 
     */
    tags: string[];
    /**
     * @return
     */
    getName() :  string;

    /**
     * @param value
     */
    setName(value: string) :  void;

    /**
     * @return
     */
    getCreatedAt() :  Date;

    /**
     * @param value
     */
    setCreatedAt(value: Date) :  void;

}