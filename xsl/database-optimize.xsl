<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:ext="http://exslt.org/common" exclude-result-prefixes="ext msxsl">
	<xsl:output method="xml" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:variable name="root" select="/" />
	<xsl:variable name="linkedsheet" select="substring(local-name(/*[1]/*[starts-with(name(.), '_')]),2)" />
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
		</xsl:copy>
	</xsl:template>

	<xsl:template match="*[attribute::*[local-name() = substring(local-name(/*[1]/*[starts-with(name(.), '_')]), 2)]]">
		<xsl:text> ADD SOME FUCKING TESXT </xsl:text>
		<xsl:variable name="el" select="."></xsl:variable>
		<xsl:variable name="ids">
			<xsl:call-template name="split">
				<xsl:with-param name="pText" select="attribute::*[local-name() = substring(local-name(/*[1]/*[starts-with(name(.), '_')]), 2)]" />
			</xsl:call-template>
		</xsl:variable>
		<xsl:for-each select="ext:node-set($ids)/*">
			<xsl:variable name="id" select="string(.)" />
			<xsl:copy>
				<xsl:apply-templates select="$el/@*[local-name() = $linkedsheet]" mode="editID" />
				<!--Do something special for Node766, like add a certain string-->
				<xsl:apply-templates select="$el/@*[not(local-name() = $linkedsheet)]" mode="editID" />
				<xsl:text> add some text </xsl:text>
			</xsl:copy>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template match="*" mode="editID">
		
	</xsl:template>

	<xsl:template name="split">
		<xsl:param name="pText" />

		<xsl:choose>
			<xsl:when test="string-length($pText) = 0" />
			<xsl:when test="contains($pText, '&#xA;')">
				<type>
					<xsl:value-of select="substring-before($pText, '&#xA;')" />
				</type>
				<xsl:call-template name="split">
					<xsl:with-param name="pText" select="substring-after($pText, '&#xA;')" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<type>
					<xsl:value-of select="$pText" />
				</type>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
