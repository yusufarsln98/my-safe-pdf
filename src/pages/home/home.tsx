import { Flex, Typography } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
	const { t } = useTranslation()

	return (
		<Flex vertical>
			<Flex
				vertical
				align='center'
			>
				<Title level={1}>{t('home.title')}</Title>
				<Paragraph
					type='secondary'
					style={{
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					{t('home.description')}
				</Paragraph>
			</Flex>
		</Flex>
	)
}
