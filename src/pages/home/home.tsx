import { Link } from '@tanstack/react-router'
import { Flex, Typography, Row, Col, Card, Alert } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import mergeIcon from '@/assets/icons/merge.svg'
import reorderIcon from '@/assets/icons/reorder.svg'
import splitIcon from '@/assets/icons/split.svg'
import imageToPdfIcon from '@/assets/icons/jpg-to-pdf.svg'

const { Title, Paragraph } = Typography

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

interface FeatureCardProps {
	icon: string
	title: string
	description: string
	to?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	icon,
	title,
	description,
	to,
}) => {
	const CardContent = (
		<Card
			hoverable
			style={{ height: '100%' }}
		>
			<Flex
				vertical
				gap={12}
			>
				<img
					src={icon}
					alt={title}
					style={{ width: 40, height: 40 }}
				/>
				<Title
					level={4}
					style={{ margin: 0 }}
				>
					{title}
				</Title>
				<Paragraph
					type='secondary'
					style={{ margin: 0 }}
				>
					{description}
				</Paragraph>
			</Flex>
		</Card>
	)

	return to ? <Link to={to}>{CardContent}</Link> : CardContent
}

export const Home: React.FC<HomeProps> = () => {
	const { t } = useTranslation()

	const features = [
		{
			icon: mergeIcon,
			title: t('home.features.merge.title'),
			description: t('home.features.merge.description'),
			to: '/merge',
		},
		{
			icon: splitIcon,
			title: t('home.features.split.title'),
			description: t('home.features.split.description'),
			to: '/split',
		},
		{
			icon: reorderIcon,
			title: t('home.features.reorder.title'),
			description: t('home.features.reorder.description'),
			to: '/arrangement',
		},
		{
			icon: imageToPdfIcon,
			title: t('home.features.imageToPdf.title'),
			description: t('home.features.imageToPdf.description'),
			to: '/image-to-pdf',
		},
	]

	return (
		<Flex
			vertical
			gap={64}
			style={{ padding: '24px' }}
		>
			<Flex
				vertical
				align='center'
			>
				<Title
					level={1}
					style={{
						fontWeight: 700,
					}}
				>
					{t('home.title')}
				</Title>
				<Paragraph
					type='secondary'
					style={{
						fontSize: 18,
						textAlign: 'center',
						width: '90%',
					}}
				>
					{t('home.description')}
				</Paragraph>
				<Alert
					message={t('home.alert')}
					type='info'
					showIcon={true}
				/>
			</Flex>

			<Row
				gutter={[24, 24]}
				style={{ width: '100%', padding: '0 24px' }}
			>
				{features.map((feature, index) => (
					<Col
						key={index}
						xs={24}
						sm={12}
						md={8}
						lg={8}
						xl={8}
					>
						<FeatureCard {...feature} />
					</Col>
				))}
			</Row>
		</Flex>
	)
}
