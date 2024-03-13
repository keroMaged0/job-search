
export class apiFeature {
    constructor(searchQuery, mongooseQuery) {
        this.searchQuery = searchQuery,
            this.mongooseQuery = mongooseQuery
    }

    //=================================== pagination ===================================//
    pagination() {
        // if not send value in query or less than one
        if (this.searchQuery.page < 1) this.searchQuery.page = 1

        // create page number
        let pageNumber = this.searchQuery.page * 1 || 1

        // create page limit
        let pageLimit = 3
        this.pageNumber = pageNumber

        // create skip
        let skip = (pageNumber - 1) * pageLimit
        this.mongooseQuery.skip(skip).limit(pageLimit)
        return this
    }

    //=================================== sort ===================================//
    sort(sortBy) {
        // if not send value in query 
        if (!sortBy) {
            // sort on createdAt desc
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }

        // replace vale in query
        let formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':')

        // store key and value
        const [key, value] = formula.split(':')

        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }

    //=================================== search ===================================//
    search(search) {

        const queryFilter = {}
        if (search.companyName) queryFilter.companyName = { $regex: search.companyName, $options: 'i' }
        if (search.jobTitle) queryFilter.jobTitle = { $regex: search.jobTitle, $options: 'i' }
        if (search.jobLocation) queryFilter.jobLocation = { $regex: search.jobLocation, $options: 'i' }
        if (search.workingTime) queryFilter.workingTime = { $regex: search.workingTime, $options: 'i' }
        if (search.seniorityLevel) queryFilter.seniorityLevel = { $regex: search.seniorityLevel, $options: 'i' }

        this.mongooseQuery = this.mongooseQuery.find(queryFilter)
        return this
    }

    //=================================== filter ===================================//
    filter(filters) {
        const queryFilter = JSON.stringify(filters)
            .replace(/gt|get|lt|lte|ne|regex/g, (operation) => { `$${operation}` })
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryFilter))
        return this
    }


}