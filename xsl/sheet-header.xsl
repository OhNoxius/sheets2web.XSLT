<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:template match="/">
		<xsl:apply-templates select="*[1]" />
	</xsl:template>

	<!-- AUTO -->
	<xsl:template match="*[1]" priority="0">
		<!--<a href="index.html">-->
		<a href="">
			<h1>
				<xsl:value-of select="name(.)" />
			</h1>
		</a>
	</xsl:template>

	<!-- MANUAL override -->

</xsl:stylesheet>
