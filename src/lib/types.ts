export interface ArticleImage {
	url: string;
	alt: string;
}

export interface Article {
	id: string;
	headline: string;
	bodyText: string;
	images: ArticleImage[];
	borderColor: string;
	headlineColor: string;
	page: 1 | 2;
	position: 1 | 2 | 3 | 4 | 5;
	featured?: boolean;
	// Legacy fields (kept for backwards compatibility)
	row?: 1 | 2 | 3;
	colSpan?: number;
}

export interface NewspaperData {
	title: string;
	subtitle: string;
	dateRange?: string;
	articles: Article[];
}
