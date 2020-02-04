<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:str="http://exslt.org/strings/">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:param name="id" />

	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyzéèëêàçö'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZEEEEACO'" />

	<xsl:template match="/">
		<xsl:apply-templates select="*[1]" mode="heading" />
	</xsl:template>

	<xsl:template match="*[1]" mode="heading">
		<xsl:apply-templates select="*[starts-with(name(.), '_')]" mode="linkedsheet" />
	</xsl:template>

	<xsl:template match="*" mode="linkedsheet">
		<table class="linkedsheet hover">
			
		</table>
	</xsl:template>
</xsl:stylesheet>
