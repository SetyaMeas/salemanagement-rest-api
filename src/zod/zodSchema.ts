import { z } from "zod";

// `const required_error = "This field cannot be blank";
// const invalid_type_error = "Invalid value provided for this field";`

const requiredError = (field: string) => `${field} cannot be blank`;
const invalidTypeError = (field: string) =>
	`Invalid value provided for ${field}`;

const minLengthMsg = (field: string, length: number) => {
	return `${field} must contain at least ${length} characters`;
};

const maxLengthMsg = (field: string, length: number) => {
	return `${field} must contain at most ${length} characters`;
};

export const zId = {
	asString: z
		.string({
			required_error: requiredError("id"),
			invalid_type_error: invalidTypeError("id"),
		})
		.trim(),
	asNumber: z.number({
		required_error: requiredError("id"),
		invalid_type_error: invalidTypeError("id"),
	}),
};

export const zOrderBy = z.union([z.literal("asc"), z.literal("desc")], {
	message: "required as asc | desc",
});

export const zUser = {
	username: z
		.string({
			required_error: requiredError("username"),
			invalid_type_error: invalidTypeError("username"),
		})
		.trim()
		.min(5, { message: minLengthMsg("username", 5) })
		.max(16, { message: maxLengthMsg("username", 16) }),
	password: z
		.string({
			required_error: requiredError("password"),
			invalid_type_error: invalidTypeError("password"),
		})
		.trim()
		.min(5, { message: minLengthMsg("password", 5) })
		.max(16, { message: maxLengthMsg("password", 16) }),
};

export const zCategory = {
	categoryName: z
		.string({
			required_error: requiredError("category name"),
			invalid_type_error: invalidTypeError("category name"),
		})
		.trim()
		.min(5, { message: minLengthMsg("category name", 5) })
		.max(30, { message: maxLengthMsg("category name", 30) }),
};

export const zProduct = {
	productName: z
		.string({
			required_error: requiredError("product name"),
			invalid_type_error: invalidTypeError("product name"),
		})
		.trim()
		.min(5, minLengthMsg("product name", 5))
		.max(30, maxLengthMsg("product name", 30)),
	categoryId: z
		.nullable(z.number({ invalid_type_error: invalidTypeError("category id") }))
		.optional(),
	price: z
		.number({
			required_error: requiredError("price"),
			invalid_type_error: invalidTypeError("price"),
		})
		.min(0, "price can not be less than 0")
		.max(100, "price can not be more than 100"),
	image: z
		.nullable(z.string({ invalid_type_error: invalidTypeError("image") }))
		.optional(),
};

export const zOffset = z.string({
	required_error: requiredError("offset"),
	invalid_type_error: invalidTypeError("offset"),
});

export const zQty = z
	.number({
		required_error: requiredError("qty"),
		invalid_type_error: invalidTypeError("qty"),
	})
	.min(1, "qty can not be less than 1");
