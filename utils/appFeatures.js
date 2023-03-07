class AppFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "page", "fields", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-duration -price");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }

    return this;
  }

  pagination() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}

module.exports = AppFeatures;
